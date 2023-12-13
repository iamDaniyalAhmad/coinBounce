import * as yup from 'yup';
const errorMessage = 'Use lowercase, uppercase and digits';
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const loginSchema = yup.object().shape({
    username : yup.string().min(5).max(30).required('Username is required'),
    password : yup.string().min(8).max(16).matches(passwordPattern , {message : errorMessage}).required()
}) 

export default loginSchema;