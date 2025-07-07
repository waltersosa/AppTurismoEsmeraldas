// Repositorio de usuarios (base)

import User from '../models/User.js';

const userRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email });
  },
  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  }
};

export default userRepository; 