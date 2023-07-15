const { Sequelize } = require('sequelize');

module.exports = {
  fetch: async () => {
    try {
      const noOfMonitors = await framework.models.users.count({
        where: { role_id: 2 },
      });
      // **********************************************************************
      // MOTIF - 0 <--- For Code type of Exams
      // MOTIF - 1 <--- For Conduite types of Exams

      const result = await framework.models.planning_exams.findOne({
        attributes: [
          [Sequelize.literal('COUNT(CASE WHEN status = "pass" AND motif=0 THEN 1 END)'), 'codeTypesInWeek'],
          [Sequelize.literal('COUNT(CASE WHEN status = "pass" AND motif=1 THEN 1 END)'), 'conduitTypesInWeek'],
          [Sequelize.literal('COUNT(CASE WHEN status = "pass" THEN 1 END)'),'passedStudentInWeek']
        ],
        where: {
          created_at: {
            [Sequelize.Op.gt]: Sequelize.literal('current_date() - interval 7 day'),
          },
        },
      });
      const codeTypesInWeek = result.get('codeTypesInWeek');
      const conduitTypesInWeek = result.get('conduitTypesInWeek');
      const passedStudentInWeek = result.get('passedStudentInWeek');

      const currentDate = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const result1 = await framework.models.planning_exams.findOne({
        attributes: [
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "pass" AND motif=0 THEN 1 END')),
            'codeTypesInMonth',
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN status = "pass" AND motif=1 THEN 1 END')),
            'conduitTypesInMonth',
          ],
        ],
        where: {
          created_at: {
            [Sequelize.Op.gt]: oneMonthAgo,
            [Sequelize.Op.lte]: currentDate,
          },
        },
      });
      const codeTypesInMonth = result1.get('codeTypesInMonth');
      const conduitTypesInMonth = result1.get('conduitTypesInMonth');
      

      const newStudents = await framework.models.students.count({
        where: {
          created_at: {
            [Sequelize.Op.gt]: Sequelize.literal('current_date() - interval 7 day '),
          },
        },
      });

      // const totalPassedStudWeek=await framework.models.planning_exams.count({
      //   where:{

      //   }
      // })

      return {
        monitors: noOfMonitors,
        codeTypesInWeek,
        conduitTypesInWeek,
        codeTypesInMonth,
        conduitTypesInMonth,
        newStudents,
        passedStudentInWeek
      };
    } catch (error) {
      console.log('Error => ', error);
      return Promise.reject(error);
    }
  },
};
