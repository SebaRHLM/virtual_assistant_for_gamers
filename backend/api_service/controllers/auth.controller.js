import { AuthService } from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
