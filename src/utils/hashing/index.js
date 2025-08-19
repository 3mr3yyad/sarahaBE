import bycrpt from "bcrypt";

export const hashPassword = (password) => {
    return bycrpt.hashSync(password, 10);
}

export const comparePassword = (password, hash) => {
    return bycrpt.compareSync(password, hash);
}
