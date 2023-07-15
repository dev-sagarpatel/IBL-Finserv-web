module.exports = {
    list: async (req, res) => {
        try {
            let users = await framework.services.users.basic.fetch();
            if (!users.length) {
                res.status(200).json({
                    message: 'no records found!',
                    error: false,
                    data: []
                })
            } else {
                let data = users.map((user) => {
                    let drivingSchools = [];
                    user?.userDrivingschool?.map((ds) => {
                        drivingSchools.push(ds?.drivingSchoolUser?.name);
                    })
                    return {
                    id: user.id,
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    email: user?.email,
                    userGroup: user?.usersRole?.name,
                    userDrivingschool: drivingSchools?.join(', '),
                }
            })
                res.status(200).json({
                    message: '',
                    error: false,
                    data: data
                });
            }
        } catch (error) {
            console.log("error =>", error);
            res.status(500).json({
                messagae: error?.message,
                error: true,
                data: error
            })
        }
    },
    single: async (req, res) => {
        try {
            let { id } = req.params;
            let user = await framework.services.users.basic.fetch(id);
            if (!user.length) {
                res.status(404).json({
                    message: 'no record found!',
                    error: true,
                    data: {}
                })
            } else {
                res.status(200).json({
                    message: '',
                    error: false,
                    data: user[0]
                });
            }
        } catch (error) {
            console.log("error =>", error);
            res.status(500).json({
                messagae: error?.message,
                error: true,
                data: error
            })
        }
    },
    create: async (req, res) => {
        try {
            let data = req.body;
            let permissions = data.permissions || [];
            let drivingSchoolUser = data.drivingSchoolUser || [];
            let user = await framework.services.users.basic.create(data);
            if (!user) {
                res.status(400).json({
                    message: 'invalid data',
                    error: true,
                    data: {}
                })
            } else {
                let userPermissions = permissions?.map((perm) => ({
                    permission_id: perm.id, user_id: user.id
                }))
                let userDrivingSchools = drivingSchoolUser?.map((school) => ({
                    drivingschool_id: school.id,
                    user_id: user.id,
                }))
                await framework.services.users.updateUser.addUpdateUserDrivingSchool(userDrivingSchools)
                await framework.services.users.updateUser.addUpdateUserPermission(userPermissions)
                res.status(200).json({
                    message: '',
                    error: false,
                    data: user
                })
            }
        } catch (error) {
            console.log("error =>", error);
            res.status(500).json({
                message: error?.message,
                error: true,
                data: error
            })
        }
    },
    update: async (req, res) => {
        try {
            let { id } = req.params;
            let data = req.body;
            let newAddPermission = data.newAddPermission || [];
            let newAddSchool = data.newAddSchool || [];
            let deletedSchool = data.deletedSchool || [];
            let deletedPermission = data.deletedPermission || [];
            let user = await framework.services.users.basic.update(id, data);
            if (!user) {
                res.status(400).json({
                    message: 'invalid data or record does not exists',
                    error: true,
                    data: {}
                })
            } else {
                let permissionsToUpdate = newAddPermission?.map((permission) => ({user_id: id, permission_id: permission.id}))
                let drivingSchoolsToUpdate = newAddSchool?.map((school) => ({user_id: id, drivingschool_id: school.id}))
                await framework.services.users.updateUser.addUpdateUserPermission(permissionsToUpdate);
                await framework.services.users.updateUser.addUpdateUserDrivingSchool(drivingSchoolsToUpdate);
                await framework.services.users.updateUser.deleteUserPermission(deletedPermission);
                await framework.services.users.updateUser.deleteUserDrivingSchool(deletedSchool);
                res.status(200).json({
                    message: '',
                    error: false,
                    data: user
                })
            }
        } catch (error) {
            console.log("error =>", error);
            res.status(500).json({
                message: error?.message,
                error: true,
                data: error
            })
        }
    },
    delete: async (req, res) => {
        try {
            let { id } = req.params;
            let user = await framework.services.users.basic.delete(id);
            if (!user) {
                res.status(400).json({
                    message: 'invalid data or record does not exists',
                    error: true,
                    data: {}
                })
            } else {
                res.status(200).json({
                    message: '',
                    error: false,
                    data: user
                })
            }
        } catch (error) {
            console.log("error =>", error);
            res.status(500).json({
                message: error?.message,
                error: true,
                data: error
            })
        }
    }
}