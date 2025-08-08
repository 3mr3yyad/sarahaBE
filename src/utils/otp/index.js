/**
 *   @param {Number} expiryTime - in minutes - default is 5
 *  @returns Object { otp, otpExpiry }
**/

export const generateOtp = (expiryTime = 5) => {
    const otp = Math.floor(Math.random() * 90000 + 10000);
    const otpExpiry = new Date(Date.now() + expiryTime * 60 * 1000);
    return { otp, otpExpiry };
}
