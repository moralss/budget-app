/* eslint-disable indent */
export const GlobalMixin = {
    data () {
        return {

        }
    },
    methods: {
        // postValue (route, object) {
        //     this.$q.loading.show()
        //     return this.$axios
        //         .post(route, object)
        //         .then(response => {
        //             this.$q.loading.hide()
        //             this.showSuccess('Done')
        //             return response
        //         })
        //         .catch(error => {
        //             this.$q.loading.hide()

        //             this.showError(error)
        //         })
        // },
        // hasRole (roles, userRoles) {
        //     if (userRoles == null) {
        //         this.logoutGlobal()
        //         return
        //     }
        //     if (roles.length === 0) {
        //         return true
        //     }
        //     for (var i = 0; i < roles.length; i++) {
        //         if (userRoles) {
        //             for (var j = 0; j < userRoles.length; j++) {
        //                 if (userRoles[j].Label.toLowerCase() === roles[i].toLowerCase()) {
        //                     return true
        //                 }
        //             }
        //         }
        //     }
        //     return false
        // },
        // getValues (route) {
        //     this.$q.loading.show()
        //     return this.$axios
        //         .get(route)
        //         .then(response => {
        //             this.$q.loading.hide()
        //             return response.data
        //         })
        //         .catch(error => {
        //             this.$q.loading.hide()
        //             this.showError(error)
        //         })
        // },
        buildErrorMessage (error) {
            var message = ''
            if (!error) {
                message = 'There was an error'
            } else {
                if (error.response && error.response.data && error.response.data.Message) {
                    message += error.response.data.Message + '\n'
                }
                if (error.response) {
                    for (let index = 0; index < error.response.data.length; index++) {
                        const element = error.response.data[index]
                        message += element.message + '\n'
                    }
                } else {
                    if (error.message) {
                        message = error.message
                    } else {
                        message = error
                    }
                }
            }
            return message
        },
        showSuccess (message) {
            this.$q.notify({ message: message, color: 'positive', icon: 'done' })
        },
        showError (message) {
            this.$q.notify({ message: this.buildErrorMessage(message), color: 'negative', icon: 'error' })
        },
        logoutGlobal () {
            this.$fireAuth.signOut().then(() => {
                // this.$router.replace('/login')
            })
        }
    }
}
