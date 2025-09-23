import express from 'express';
import { createReservation, getAllReservations, getReservationsByCustomer, updateReservation } from '../controllers/reservationController.js';


const reservationRouter = express.Router();

reservationRouter.post('/', createReservation);
reservationRouter.get('/', getAllReservations);
reservationRouter.patch('/', updateReservation);
reservationRouter.get('/:id', getReservationsByCustomer);
reservationRouter.delete('/:id', updateReservation);

export default reservationRouter;