import express from "express";

import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody, isEmptyFile, resizeAvatar, upload} from '../../midllewares/index.js'
import {validateBody} from '../../decorators/index.js';
import { userSignupSchema, userSigninSchema, usersUpdateSubscribeSchema, userEmailSchema} from "../../models/User.js";


const authRouter = express.Router();
// upload.fields([{name: 'poster, maxCount: 1}]) - кілька полів
// upload.array('poster', 8) - кілька файлів
authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), resizeAvatar, authController.signup);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post('/verify', isEmptyBody, validateBody(userEmailSchema), authController.resendVerify);

authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/logout', authenticate, authController.signout);

authRouter.patch('/update', authenticate, isEmptyBody, validateBody(usersUpdateSubscribeSchema), authController.updateSubscription);

authRouter.patch('/avatars', authenticate, upload.single('avatarURL'), isEmptyFile, resizeAvatar, authController.updateAvatar);

export default authRouter;