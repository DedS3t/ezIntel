"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/config/firebase";
import { collection, getDocs } from "@firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

let parseKeywords = (keywords: string[]) => {
  if (keywords.length === 0) return "None";

  if (keywords.length > 4) {
    return `${keywords.slice(0, 4).join(", ")}...`;
  }

  return keywords.join(", ");
};

export default () => {
  const router = useRouter();
  let [agents, setAgents] = useState<any[]>([]);

  const get_data_agents = async () => {
    const col = collection(db, "action_agents");
    const snapshot = await getDocs(col);

    setAgents(
      snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      }),
    );
  };

  useEffect(() => {
    get_data_agents();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb
        rootName=" "
        rootPath="/action_agents"
        pageName="Action Agents"
      />

      <Link
        href="/action_agents/new"
        className="mb-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        Create New
      </Link>

      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {agents.map((agent) => (
            <div
              onClick={() => {
                router.push(`/action_agents/${agent.id}`);
              }}
              key={agent.id}
              className="cursor-pointer rounded-lg bg-white p-6 shadow dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {agent.data.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Type: {agent.data.type} Agent
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {agent.data.logs?.length || 0} Blogs
              </p>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
