import { IUser, IUserMethods, UserModel } from '@types-database';
import { Model as ModelType } from '@types-utils';
import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import uniqueValidator from 'mongoose-unique-validator';

const emailValidator = (email: string) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    minlength: [3, 'must not be less than 3 characters'],
    maxlength: [50, 'must not be more than 50 characters'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [5, 'must not be less than 5 characters'],
  },
  refreshToken: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  surname: {
    type: String,
    required: [true, 'surname is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
    validate: [emailValidator, 'please fill a valid email address'],
  },
  avatarImageURL: {
    type: String,
  },
  pinnedBoards: [
    {
      _id: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelType.Board,
    },
  ],
  notifications: [
    {
      title: String,
      description: String,
      key: String,
      attributes: Object,
      timeStamp: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

// userSchema.plugin(uniqueValidator, { message: '{VALUE} is already used by another user' });

// userSchema.pre('save', async function (next) {
//   const user = this;

//   // only hash the password if it has been modified (or is new)
//   if (user.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(user.password, salt);
//   }
//   next();
// });

// userSchema.methods.isValidPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

export const userModel = mongoose.model<IUser, UserModel>(ModelType.User, userSchema);
