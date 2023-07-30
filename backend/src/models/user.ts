import mongoose from 'mongoose';
import { Password } from '../services/password';
import { ROLE } from '../types/role';

interface UserAttrs {
  user: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  usersCreated?: [];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  user: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  usersCreated?: [];
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLE,
      default: ROLE.ADMIN,
      required: true,
    },
    usersCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.name = `${ret.firstName} ${ret.lastName}`;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        if (ret.role == ROLE.USER) {
          delete ret.usersCreated;
        }
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
