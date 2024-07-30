export const messages = (data: any) => {
    var language = data;
    if (language == 'mace') {
        var messages = {
            "invalidAddress": "Not a valid address",
            "adminWithSameEmail": "Админ со {{email}} ИД веќе постои.",
            "noSuchAccount": "No such account exist with this email.",
            "WrongPassword": "Wrong Password Please fill Correct Password.",
            "invalidPickupAddress": "Not a valid pickup address.",
            "invalidDeliveryAddress": "Not a valid delivery address.",
            "accountAlreadyExist": "Account with given Phone number and Role already exist.",
            "noSuchAccountExist": "No such account exist.",
            "invalidMongoId": "{{key}} must be a valid mongo ID",
            "noDatafound": "No Record Found",
            "modelFound": "With this Name Model already exist",
            "alreadyExist": "Веќе постои",
            "userExist": "Корисникот веќе излегува",
            "phoneNumberTaken": "Phone number already taken by some other user.",
            "invalidAction": "Invalid action",
            "unprocessableEntity": "Unprocessable entity",
            "somethingwrong": "Something went wrong",
            "bookingStatusError": "Status can't be changed from '{{old}}' state to '{{new}}' state.",
            "accountBlocked": "Account blocked by admin.",
            "sessionExpired": "Session expired! Please login again.",
            "noToken": "Invalid token",
            "unAuthRole": "Unauthorized role! Access denied",
            "incorrectOldPass": "Please enter correct old password",
            "accountUnverifiedAdmin": "Your Account is unverified, please contact Admin",
            "addressTypeUse":"{{type}}  address already set ! please try another one",
            "success":"success"
        }

        return messages;
    } else if (language == 'en') {
        var messages = {
            "invalidAddress": "Not a valid address",
            "adminWithSameEmail": "Admin with {{email}} Id already exist.",
            "noSuchAccount": "No such account exist with this email.",
            "WrongPassword": "Wrong Password Please fill Correct Password.",
            "invalidPickupAddress": "Not a valid pickup address.",
            "invalidDeliveryAddress": "Not a valid delivery address.",
            "accountAlreadyExist": "Account with given Phone number and Role already exist.",
            "noSuchAccountExist": "No such account exist.",
            "invalidMongoId": "{{key}} must be a valid mongo ID",
            "noDatafound": "No Record Found",
            "modelFound": "With this Name Model already exist",
            "alreadyExist": "Already Exists",
            "userExist": "User already Exist",
            "phoneNumberTaken": "Phone number already taken by some other user.",
            "invalidAction": "Invalid action",
            "unprocessableEntity": "Unprocessable entity",
            "somethingwrong": "Something went wrong",
            "bookingStatusError": "Status can't be changed from '{{old}}' state to '{{new}}' state.",
            "accountBlocked": "Account blocked by admin.",
            "sessionExpired": "Session expired! Please login again.",
            "noToken": "Invalid token",
            "unAuthRole": "Unauthorized role! Access denied",
            "incorrectOldPass": "Please enter correct old password",
            "accountUnverifiedAdmin": "Your Account is unverified, please contact Admin",
            "addressTypeUse":"{{type}}  address already set ! Try another one",
            "success":"success"
        }

        return messages;
    }

    else {

        var messages = {
            "invalidAddress": "Not a valid address",
            "adminWithSameEmail": "Admin with {{email}} Id already exist.",
            "noSuchAccount": "No such account exist with this email.",
            "WrongPassword": "Wrong Password Please fill Correct Password.",
            "invalidPickupAddress": "Not a valid pickup address.",
            "invalidDeliveryAddress": "Not a valid delivery address.",
            "accountAlreadyExist": "Account with given Phone number and Role already exist.",
            "noSuchAccountExist": "No such account exist.",
            "invalidMongoId": "{{key}} must be a valid mongo ID",
            "noDatafound": "No Record Found",
            "modelFound": "With this Name Model already exist",
            "alreadyExist": "Already Exists",
            "userExist": "User already Exist",
            "phoneNumberTaken": "Phone number already taken by some other user.",
            "invalidAction": "Invalid action",
            "unprocessableEntity": "Unprocessable entity",
            "somethingwrong": "Something went wrong",
            "bookingStatusError": "Status can't be changed from '{{old}}' state to '{{new}}' state.",
            "accountBlocked": "Account blocked by admin.",
            "sessionExpired": "Session expired! Please login again.",
            "noToken": "Invalid token",
            "unAuthRole": "Unauthorized role! Access denied",
            "incorrectOldPass": "Please enter correct old password",
            "accountUnverifiedAdmin": "Your Account is unverified, please contact Admin",
            "addressTypeUse":"{{type}}  address already set ! Try another one",
            "success":"success"
        }

        return messages;

    }

}