import User from '../models/User.js';

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    // Sort by createdAt in descending order (newest first)
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    // Handle special case for toggling status
    if (req.body.status === 'toggle') {
      // First get the current user to check status
      const currentUser = await User.findById(req.params.id).select('-password');
      if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });
      
      // Toggle between 'Active' and 'Suspended'
      const newStatus = currentUser.status === 'Suspended' ? 'Active' : 'Suspended';
      
      const user = await User
        .findByIdAndUpdate(req.params.id, { status: newStatus }, { new: true, runValidators: true })
        .select('-password');
        
      return res.json({ success: true, data: user });
    }
    
    // Normal update case
    const user = await User
      .findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    const status = err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ success: false, message: status === 400 ? 'Invalid user id' : 'Server error' });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    const status = err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ success: false, message: status === 400 ? 'Invalid user id' : 'Server error' });
  }
};