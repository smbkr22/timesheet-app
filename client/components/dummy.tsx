import React, { useEffect, useState } from "react";

function MemberTaskComponent() {
  const [memberTaskData, setMemberTaskData] = useState([]);

  useEffect(() => {
    // Fetch MemberTask data
    fetch("URL_TO_YOUR_API_ENDPOINT")
      .then((response) => response.json())
      .then(async (data) => {
        if (data.status === "success") {
          // Get an array of unique userIds
          const userIds = [
            ...new Set(data.data.memberTaskInfos.map((task) => task.userId)),
          ];

          // Fetch user information for each userId
          const usersPromises = userIds.map((userId) => {
            return fetch(`URL_TO_FETCH_USER_INFO/${userId}`)
              .then((response) => response.json())
              .then((userData) => {
                // Combine user information with member task data
                const memberTasksWithUserInfo = data.data.memberTaskInfos.map(
                  (task) => {
                    if (task.userId === userId) {
                      return {
                        ...task,
                        userInfo: userData, // Add user information to the member task data
                      };
                    }
                    return task;
                  }
                );
                return memberTasksWithUserInfo;
              });
          });

          // Wait for all user information fetch requests to complete
          const memberTasksWithUser = await Promise.all(usersPromises);

          // Flatten the array
          const flattenedMemberTasks = [].concat(...memberTasksWithUser);

          setMemberTaskData(flattenedMemberTasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Member Tasks</h1>
      <ul>
        {memberTaskData.map((task, index) => (
          <li key={index}>
            <p>User ID: {task.userId}</p>
            <p>Initiative ID: {task.initiativeId}</p>
            <p>Start Date: {task.startDate}</p>
            <p>End Date: {task.endDate}</p>
            {task.userInfo && (
              <div>
                <p>User Information:</p>
                <p>Name: {task.userInfo.name}</p>
                <p>Email: {task.userInfo.email}</p>
                {/* Add other user information properties as needed */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberTaskComponent;
