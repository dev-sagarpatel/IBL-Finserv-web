module.exports = {
    addUserGroup: async (data) => {
        return await framework.models.user_group.insert(data);
    },
    addUpdateUserDrivingSchool: async (userDrivingSchools) => {
        return await framework.models.user_drivingschool.bulkCreate(userDrivingSchools, {
            updateOnDuplicate: ['drivingschool_id']
        });
    },
    addUpdateUserPermission: async (userPermissions) => {
        return await framework.models.user_permissions.bulkCreate(userPermissions, {
            updateOnDuplicate: ['permission_id']
        })
    },
    deleteUserPermission: async (deletedPermission) => {
        return await framework.models.user_permissions.destroy({
            where: {
                id: deletedPermission
            }
        })
    },
    deleteUserDrivingSchool: async (deletedSChool) => {
        return await framework.models.user_drivingschool.destroy({
            where: {
                id: deletedSChool
            }
        })
    }
}