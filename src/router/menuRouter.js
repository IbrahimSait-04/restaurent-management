import express from 'express';
import { createMenuItem, deleteMenuItem,  getMenuItems, updateMenuItem } from '../controllers/menuController.js';


const menuRouter = express.Router();

menuRouter.post('/', createMenuItem);
menuRouter.put('/:id', updateMenuItem);
menuRouter.get('/', getMenuItems);
menuRouter.get('/:id', getMenuItems);
menuRouter.delete('/:id', deleteMenuItem);


export default menuRouter;