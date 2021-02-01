import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError, IRequest } from '@shared/constants';

const router = Router();
const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

var productos = require('../database/productos.json');
var cupones = require('../database/cupones.json');

//Get endpoint/api/poductos || endpoint/api/productos?producto=1
router.get('/productos', async (req: Request, res: Response) => {
    try {
        if (req.headers.auth == 'admin') {
            if (req.query.producto != undefined)
                return res.send(productos.find(x => x.id == req.query.producto));
            else
                return res.send(productos);
        }
        else {
            res.status(401);
            return res.send("No autorizado");
        }
    } catch (error) {
        res.status(500);
        return res.send("Error interno");
    }
});

//Get endpoint/api/cupones || endpoint/api/cupones?cupone=1
router.get('/cupones', function (req, res) {
    try {
        if (req.headers.auth == 'admin') {
            if (req.query.cupon != undefined)
                return res.send(cupones.find(x => x.id == req.query.cupon));
            else
                return res.send(cupones)
        }
        else {
            res.status(401);
            return res.send("No autorizado");
        }
    } catch (error) {
        res.status(500);
        return res.send("Error interno");
    }
});

//Post endpoint/api/cupones
router.post('/cupones/crear', function (req, res) {
    let body = req.body;
    body.id = cupones[cupones.length - 1].id + 1;
    try {
        if (req.headers.auth == 'admin') {
            return(res.send(body))
        }
        else {
            res.status(401);
            return res.send("No autorizado");
        }
    } catch (error) {
        res.status(500);
        return res.send("Error interno");
    }
});

//Post endpoint/api/cupones/validar
router.post('/cupones/validar', function (req, res) {
    let body = req.body;
    let actualDate = new Date();
    let cupon = cupones.find(x => x.id == body.id);
    try {
        if (req.headers.auth == 'customer') {
            let dateSince = new Date(cupon.valid_since);
            let dateUntil = new Date(cupon.valid_until);
            if(dateSince <= actualDate && dateUntil >= actualDate)
                return res.send(cupon)
            else
                return res.send({});
        }
        else {
            res.status(401);
            return res.send("No autorizado");
        }
    } catch (error) {
        res.status(500);
        return res.send("Error interno");
    }
});

export default router;