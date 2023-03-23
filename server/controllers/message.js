import Message from '../models/message.js';
import User from '../models/user.js';

// ...

export const sendPrivateMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Create a new message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await newMessage.save()

    // Add the message to the sender's sentMessages array
    const sender = await User.findByIdAndUpdate(senderId, {
      $push: { sentMessages: newMessage },
    });

    // Add the message to the receiver's receivedMessages array
    const receiver = await User.findByIdAndUpdate(receiverId, {
      $push: { receivedMessages: newMessage },
    });

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
