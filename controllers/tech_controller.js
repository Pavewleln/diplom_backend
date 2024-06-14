import TechModel from "../models/techProcess.js";

export const get = async (req, res, next) => {
    try{
        const tech = await TechModel.find();
        res.json(tech)
    } catch(error) {
        next(error)
    }
}

export const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tech = await TechModel.findById(id);
        res.json(tech);
    } catch (error) {
        next(error);
    }
};