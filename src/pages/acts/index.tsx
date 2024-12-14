import WorkspaceList from "@/components/shared/room/components/workspace-button/workspaces";
import JoinWorkspaceWithLink from "./components/join-with-link";
import { useApi } from "@/hooks/swr";
import { useParams } from "react-router-dom";
import CotopiaInput from "@/components/shared-ui/c-input";
import axiosInstance from "@/services/axios";
import { useState } from "react";
import CotopiaButton from "@/components/shared-ui/c-button";
import UserSelector from "@/components/shared/user-selector";

function getDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const dd = String(date.getDate()).padStart(2, "0"); // Add leading zero
  return `${yyyy}-${mm}-${dd}`;
}

type ActType = {
  id: number;
  join_at: string;
  left_at: string;
  diff: number;
  diff_in_minutes: number;
  diff_in_hours: number;
  room_id: number;
  workspace_id: number;
  data: string;
};
export default function Acts() {
  // return (window.location.href = "https://lite-api.cotopia.social/logs");

  document.cookie =
    "tester1=testSalam; path=/; domain=.cotopia.social; Secure; SameSite=None";

  // Log the cookie
  console.log(document.cookie);

  // Redirect to the Laravel backend
  window.location.href = "https://vdi.cotopia.social";
  const now = new Date();
  const firstDateOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastDateOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Setting day to 0 gets the last day of the previous month

  const [startAt, setStartAt] = useState(getDate(firstDateOfMonth));
  const [userId, setUserId] = useState<number | null>(null);
  const [endAt, setEndAt] = useState(getDate(lastDateOfMonth));
  const [acts, setActs] = useState<ActType[]>([]);

  const getActs = async (user_id: number | null = null) => {
    setActs([]);
    const data = await axiosInstance.get(
      `/activities/${user_id === null ? userId : user_id}?start_at=${startAt}&end_at=${endAt}`,
    );

    setActs(data.data.data);
  };
  return (
    <div className="w-full mx-auto px-4 md:px-0 flex flex-col gap-y-8 py-8 ">
      <div className={"flex flex-col p-4 border gap-4  justify-center"}>
        <div>
          <UserSelector
            label={false}
            onPick={async (user) => {
              setUserId(user.id);
              await getActs(user.id);
              // handleUserIdChange(user.id.toString());
            }}
          />
          <CotopiaInput
            placeholder="Enter the start date (YYYY-MM-DD)"
            label="start at"
            type="date"
            value={startAt}
            onChange={(e) => {
              setStartAt(e.target.value);
            }}
          />
          <CotopiaInput
            placeholder="Enter the end date (YYYY-MM-DD)"
            label="end at"
            type="date"
            value={endAt}
            onChange={(e) => {
              setEndAt(e.target.value);
            }}
          />
        </div>
        <CotopiaButton
          onClick={async () => {
            await getActs();
          }}
          disabled={!userId}
        >
          Get
        </CotopiaButton>
      </div>

      <div className={"flex flex-col gap-4"}>
        <div className={"flex flex-row gap-2 items-center justify-center"}>
          <div>
            Total Hours:{" "}
            {acts.reduce((sum, item) => sum + item.diff_in_hours, 0).toFixed(2)}
          </div>
          <div>
            Total Minutes:{" "}
            {acts
              .reduce((sum, item) => sum + item.diff_in_minutes, 0)
              .toFixed(2)}
          </div>
          <div>
            Has null ?{" "}
            {acts.filter((act) => act.left_at === null).length > 0
              ? "Yes"
              : "No"}
          </div>
        </div>

        {acts.map((act) => {
          return (
            <div
              key={act.id}
              className={
                "flex flex-row items-center justify-start gap-4 w-full px-4"
              }
            >
              <div className={"w-1/6"}>{act.id}</div>
              <div className={"w-2/6"}>{act.join_at}</div>
              <div
                className={
                  "w-2/6" + (act.left_at === null ? " bg-red-500" : "")
                }
              >
                {act.left_at === null ? "NULL" : act.left_at}
              </div>
              <div className={"font-bold w-1/6"}>{act.diff}</div>
              <div className={"w-1/6"}>{act.diff_in_hours.toFixed(2)}</div>
              <div className={"w-1/6"}>{act.diff_in_minutes.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
