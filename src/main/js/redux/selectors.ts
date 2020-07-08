// import {RootState} from "./reducers/rootReducer";
// import { createSelector } from "reselect";
//
// const getUser = (state: RootState) => state.user;
//
// export const getUserRoleByProjectId = createSelector(selectTeamMembersByProjectId, getUser, (membersByProjectId, user) => {
//   return membersByProjectId.find(member => member.userId === user.id);
// })
//
// const getUserWithProjectsByUserId = (state: RootState, userId: number) => createSelector(selectTeamMembers, selectProjectsArray, (teamMembers, projects) => {
//
// })
//
// export const getUsersWithMemberships = (state: RootState) => {
//   const users = [];
//   const findUserIdx = (userId: number) => users.findIndex((user) => user.id === userId);
//   Object.values(state.teamMembers).map(({
//     userId, username, projectId, role,
//   }) => {
//     const userIdx = findUserIdx(userId);
//     const { name, id } = getProjectById(state, projectId);
//     if (userIdx !== -1) {
//       users[userIdx].memberships.push({
//         project: {
//           name,
//           id,
//         },
//         role,
//       });
//     } else {
//       users.push({
//         id: userId,
//         username,
//         memberships: [{
//           project: {
//             name, id,
//           },
//           role,
//         }],
//       });
//     }
//   });
//   return users;
// };