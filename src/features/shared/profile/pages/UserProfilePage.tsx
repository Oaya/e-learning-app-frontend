import { useParams } from "react-router-dom";
import { UserModel } from "../../../../models/user";
import defaultAvatar from "../../../../assets/user.png";
import { useUser } from "../../../admin/students/hooks/useUser";
import StatCard from "../../../admin/dashboard/components/StatCard";
import {
  HiCalendar,
  HiCreditCard,
  HiDocumentText,
  HiUsers,
} from "react-icons/hi";

export default function UserProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const userId = id || "";
  const { user, isLoading } = useUser(userId);

  if (!userId) return <p>User ID is missing.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-10">
      <section className="mt-3 gap-2 rounded-lg border border-gray-300 bg-white p-8">
        <div className="flex">
          <div className="justify-center">
            <div className="group relative h-32 w-32">
              <img
                src={user.avatar || defaultAvatar}
                alt="avatar"
                className="h-23 w-23 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="text-left">
            <div className="mb-2">
              <p className="text-2xl font-semibold">
                {new UserModel(user).fullName()}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex">
          <button className="btn-primary">Book Session</button>
          <button className="btn-primary">Message</button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 py-10 lg:grid-cols-4">
        <StatCard
          icon={<HiUsers size={20} className="text-theme-yellow-20" />}
          label="Total sessions"
          value={10}
          sub="3 this month"
          subColor
        />
        <StatCard
          icon={<HiCalendar size={20} className="text-theme-yellow-20" />}
          label="Homework rate"
          value={80}
          sub="On track"
        />
        <StatCard
          icon={<HiDocumentText size={20} className="text-theme-yellow-20" />}
          label="Goal completed"
          value={"2/3"}
          sub="2 in progress"
        />
        <StatCard
          icon={<HiCreditCard size={20} className="text-theme-yellow-20" />}
          label="Balance"
          value="$60"
          sub="1 session owed"
        />
      </section>
    </div>
  );
}
