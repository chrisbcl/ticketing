import mongoose from 'mongoose';
import { PasswordManager } from '../services/password-manager';

// Describes the attributes that are required to create a new User
export interface UserAttrs {
    email: string;
    password: string;
}

// Describes the User JSON format to be sent as the response
interface UserResponse {
    id: string;
    email: string;
}

// Describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument;
}

// Describes the properties that a User Document has
interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
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
    },
    {
        toJSON: {
            transform: (doc: UserDocument): UserResponse => ({
                id: doc.id,
                email: doc.email,
            }),
        },
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hash = await PasswordManager.toHash(this.get('password'));
        this.set('password', hash);
    }
    done();
});

userSchema.statics.build = (userAttrs: UserAttrs) => {
    return new User(userAttrs);
};

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
