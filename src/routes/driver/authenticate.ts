import express from 'express';
import Driver from '../../models/driver';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/authenticate', (req, res) => {
    // Copy body object
    const data = Object.assign(req.body);

    console.log(data);

    if (!data.hasOwnProperty('username')) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'username' is required",
        });
    }

    if (!data.hasOwnProperty('password')) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Field 'password' is required",
        });
    }

    Driver.findOne({username: data.username})
        .exec()
        .then((temp) => {
            if(!temp){
                return res.status(401).send();
            }
            const driver = temp.toObject();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            bcrypt.compare(data.password, driver.password).then((correct) => {
                if(correct){
                    return res
                        .status(200)
                        .json(jwt.sign(driver, process.env.SECRET, { expiresIn: '30d' }))
                        .send();
                }
                return res.status(401).send();
            });

        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err).send();
        })
});

export default router;