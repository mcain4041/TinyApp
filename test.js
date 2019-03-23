

function retrieveUser(email, password, Users) {

    for (var user_id in Users) {
        let userEmail = Users[user_id]["email"]
        let userPassword = Users[user_id]["password"]

        if (email === userEmail && password === userPassword)
            return Users[user_id]
    }
}
retrieveUser("", "1234", Users)


