import Message from '../models/message.js';
import User from '../models/user.js';

export const saveMessage = async (senderId, receiverId, message) => {
    try {
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        message,
      });
  
      await newMessage.save();
  
      await User.findByIdAndUpdate(senderId, {
        $push: { sentMessages: newMessage },
      });
  
      await User.findByIdAndUpdate(receiverId, {
        $push: { receivedMessages: newMessage },
      });
  
      return newMessage;
    } catch (err) {
      console.error(err);
      throw new Error('Error saving message.');
    }
  };

  


export const sendPrivateMessage = async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;
  
      const newMessage = await saveMessage(senderId, receiverId, message);
  
      res.json({ message: 'Message sent successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  

export const getPrivateMessage = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
    
        const messages = await Message.find({
          $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 },
          ],
        })
          .sort({ timestamp: 1 })
          .populate('sender receiver', 'name');
    
        res.json({ messages });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
      }

}
