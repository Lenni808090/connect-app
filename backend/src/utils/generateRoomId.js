export const createRoomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTRUFWQYZ";
    const lenght = 6;

    let result = "";

    for (let i = 0; i < lenght;i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

