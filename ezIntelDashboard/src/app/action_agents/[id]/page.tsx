"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/config/firebase";
import { doc, getDoc } from "@firebase/firestore";
// get id from query
// query agent with that id from firestore
// present all data

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
  // const { query } = useRouter();
  let router = useRouter();
  let params = useParams();

  let [agent, setAgent] = useState<any>(null);
  let [selectedBlog, setSelectedBlog] = useState<any>(null);

  const id = params.id;

  const fetchAgent = async () => {
    const docRef = doc(db, "action_agents", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setAgent({
        id: docSnap.id,
        data: docSnap.data(),
      });
    } else {
      // doc.data() will be undefined in this case
      alert("No such agent!");
      router.push("/action_agents");
    }
  };

  useEffect(() => {
    if (id) {
      fetchAgent();
    }
  }, [id]);

  return (
    <DefaultLayout>
      <Breadcrumb
        rootName="Action Agents"
        rootPath="/action_agents"
        pageName={agent ? agent.data.name : "Agent"}
      />
      <div className="my-5">
        <h3 className="text-lg font-semibold text-black">Context Provided: </h3>
        <p>{agent ? agent.data.config.additional_context : ""}</p>
      </div>

      {agent && (
        <LogTable
          logs={agent.data.logs || []}
          setSelectedBlog={setSelectedBlog}
        />
      )}

      {selectedBlog !== null && (
        <div className="my-5 text-center">
          <h3 className="text-2xl font-semibold text-black">Selected Blog: </h3>
          <div className="m-auto mt-2 w-[80%]">
            <p>{agent.data.logs[selectedBlog].body}</p>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

const LogTable = ({
  logs,
  setSelectedBlog,
}: {
  logs: any[];
  setSelectedBlog: (arg0: string) => void;
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Blogs
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Title
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Description
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Keywords
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Body
            </h5>
          </div>
        </div>

        {logs.map((log, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === logs.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
            onClick={() => {
              setSelectedBlog(key);
            }}
          >
            {/* <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image src={brand.logo} alt="Brand" width={48} height={48} />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {brand.name}
              </p>
            </div>
            */}

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{log.title}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{log.time}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{log.description}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{log.keywords}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{log.body.length} chars</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="my-6 text-center text-gray-500 dark:text-gray-300">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
};
