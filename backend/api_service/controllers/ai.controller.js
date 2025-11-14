import { aiService } from "../services/ai.service.js";

export const aiController = async (req, res) => {
    try {
        const result = await aiService.getResponse(req, res);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
      console.error("Error en AIController:", error);
      res.status(500).json({ success: false, message: error.message });
    }
};

