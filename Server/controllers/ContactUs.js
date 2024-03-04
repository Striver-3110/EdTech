const mailSender = require('../utils/nodeMailer')
const contactUsEmail = require('../mail/templates/contactFormRes')
exports.contactUsController = async (req, res) => {
    const { email, fistname, lastname, message, phonenumber, countrycode } = req.body
    console.log(req.body)

    try {
        const emailResponse = await mailSender(
            email,
            'Your data send successfully',
            contactUsEmail(email,firstname,lastname,message,phonenumber,countrycode)
        )
        return res.status(200).json({
            success: true,
            message:'Email send Successfully'
        })
    } catch (error) {
        console.log('Error :', error)
        console.log('Error message:', error.message)
        return res.json({
            success: false,
            message:"Something went wrong while sending contactus form"
        })
    }
}