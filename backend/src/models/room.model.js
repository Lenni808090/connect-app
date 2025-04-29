import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId:{
        type: String,
        required: true,
        unique: true,
    },

    round: {
        type: Number,
        default: 0,
        min: 0
    },

    currentScore:{
        type: Number,
        default: 0,
        min: 0,
    },
    
    players:[{
        username: {
            type: String,
            required: true,
        },
        socketId: {
            type: String,
            required: true,
        },
        isHost:{
            type: Boolean,
            default: false,
        }
    }],

    gameState: {
        type: String,
        enum: ['waiting', 'playing', 'voting', 'finished'],
        default: 'waiting',
    },

    currentCategory: {
        type: String,
        default: null,
    },

    submissions: [{
        socketId: {
            type: String,
            required: true,
        },
        word: {
            type: String,
            required: true,
        }

    }],

    categories: {
        type: Array,
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
    }

  },

  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
