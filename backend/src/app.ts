import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
// auth routes
import { currentUserRouter } from './routes/auth/current-user';
import { signinRouter } from './routes/auth/signin';
import { signupRouter } from './routes/auth/signup';
import { signoutRouter } from './routes/auth/signout';
import { currentUser } from './middlewares/current-user';

import { getUsersRouter } from './routes/users/get-users';
import { createUserRouter } from './routes/users/create-user';
import { deleteUserRouter } from './routes/users/delete-user';
import { editUserRouter } from './routes/users/edit-user';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express();
// express aware that it is behind a proxy like nginx
// and should trust the proxy to handle the https connection
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(getUsersRouter);
app.use(createUserRouter);
app.use(editUserRouter);
app.use(deleteUserRouter);

// handles the case where the route is not found
app.all('*', async () => {
  throw new NotFoundError('route did not found');
});
app.use(errorHandler);

export { app };
