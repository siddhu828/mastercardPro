const Message = require('../models/Message');

exports.getThread = async (req, res, next) => {
  try{
    const { withUserId } = req.params;
    const me = req.user._id;
    const msgs = await Message.find({
      $or: [{ from: me, to: withUserId }, { from: withUserId, to: me }]
    }).sort('createdAt');
    res.json(msgs);
  }catch(err){ next(err); }
};

exports.sendMessage = async (req, res, next) => {
  try{
    const me = req.user._id;
    const { to, body } = req.body;
    const msg = await Message.create({ from: me, to, body });
    const io = req.app.get('io');
    io.to(String(to)).emit('chat:message', msg);
    res.json(msg);
  }catch(err){ next(err); }
};

exports.registerChatHandlers = (io, socket) => {
  socket.on('auth', (userId) => {
    if (userId) socket.join(String(userId));
  });

  socket.on('chat:send', async ({ from, to, body }) => {
    if (!from || !to || !body) return;
    const msg = await Message.create({ from, to, body });
    io.to(String(to)).emit('chat:message', msg);
    io.to(String(from)).emit('chat:delivered', msg._id);
  });

  socket.on('disconnect', () => {});
};