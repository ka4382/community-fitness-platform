import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Group, GroupMessage

User = get_user_model()


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f'group_{self.group_id}'
        
        # Authenticate user via JWT token
        try:
            token = self.scope['query_string'].decode().split('token=')[1]
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.user = await self.get_user(user_id)
            
            if not self.user:
                await self.close()
                return
            
            # Check if user is a member of the group
            is_member = await self.is_group_member(self.user, self.group_id)
            if not is_member:
                await self.close()
                return
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            
            # Send message history
            messages = await self.get_message_history(self.group_id)
            await self.send(text_data=json.dumps({
                'type': 'message_history',
                'messages': messages
            }))
            
        except (TokenError, IndexError, Exception) as e:
            print(f"WebSocket connection error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                message_text = data.get('message', '').strip()
                
                if not message_text:
                    return
                
                # Save message to database
                message = await self.save_message(
                    group_id=self.group_id,
                    user=self.user,
                    text=message_text
                )
                
                # Broadcast to room group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': {
                            'id': message['id'],
                            'text': message['text'],
                            'sender': message['sender'],
                            'created_at': message['created_at']
                        }
                    }
                )
        except Exception as e:
            print(f"Error receiving message: {e}")

    async def chat_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def is_group_member(self, user, group_id):
        try:
            group = Group.objects.get(id=group_id)
            return group.members.filter(id=user.id).exists()
        except Group.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, group_id, user, text):
        try:
            group = Group.objects.get(id=group_id)
            message = GroupMessage.objects.create(
                group=group,
                sender=user,
                text=text
            )
            return {
                'id': message.id,
                'text': message.text,
                'sender': {
                    'id': user.id,
                    'username': user.username,
                    'full_name': user.full_name or user.username
                },
                'created_at': message.created_at.isoformat()
            }
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    @database_sync_to_async
    def get_message_history(self, group_id):
        try:
            messages = GroupMessage.objects.filter(
                group_id=group_id
            ).select_related('sender').order_by('-created_at')[:50]
            
            return [
                {
                    'id': msg.id,
                    'text': msg.text,
                    'sender': {
                        'id': msg.sender.id,
                        'username': msg.sender.username,
                        'full_name': msg.sender.full_name or msg.sender.username
                    },
                    'created_at': msg.created_at.isoformat()
                }
                for msg in reversed(messages)
            ]
        except Exception as e:
            print(f"Error fetching message history: {e}")
            return []
