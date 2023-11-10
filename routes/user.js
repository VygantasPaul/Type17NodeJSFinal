import express from 'express';
import {
    ALL_USERS,
    REGISTER_USER,
    LOGIN_USER,
    GET_USER_BY_ID,
    GET_USERS_WITH_TICKETS,
    GET_USER_ID_WITH_TICKETS,
    USER_BY_ID_DELETE,
    USER_BY_ID_EDIT
} from '../controller/user.js'
const router = express.Router();
import auth from '../middleware/auth.js'
import validation from '../middleware/validation.js'
import userRegSchema from '../validation/userRegSchema.js';
import userLoginSchema from '../validation/userLoginSchema.js';
import refreshToken from '../middleware/refreshToken.js'

router.post('/register', validation(userRegSchema), REGISTER_USER)
router.post('/login', validation(userLoginSchema), LOGIN_USER)

router.get('/', auth, ALL_USERS)

router.get('/withTickets/', auth, GET_USERS_WITH_TICKETS)
router.get('/:id/withTickets/', auth, GET_USER_ID_WITH_TICKETS)

router.get('/:id', auth, GET_USER_BY_ID)
router.put('/:id', auth, USER_BY_ID_EDIT)
router.delete('/:id', auth, USER_BY_ID_DELETE)

router.post('/refreshToken', refreshToken)


export {
    REGISTER_USER,
    ALL_USERS,
    LOGIN_USER,
    GET_USER_BY_ID,
    GET_USERS_WITH_TICKETS,
    GET_USER_ID_WITH_TICKETS,
    USER_BY_ID_DELETE,
    USER_BY_ID_EDIT
}

export default router;