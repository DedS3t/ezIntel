"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/config/firebase";
import { addDoc, collection } from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default () => {
  let router = useRouter();
  const typeOptions = ["Blog Proposer"];
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [additionalContext, setAdditionalContext] = useState("");

  const create_agent = async (e) => {
    e.preventDefault();
    if (name.length < 3) {
      alert("Name must be at least 3 characters long");
      return;
    }
    if (additionalContext.length < 5) {
      alert("Please provide sufficient additional context.");
      return;
    }

    // create new agent on firebase
    const col = collection(db, "action_agents");
    try {
      addDoc(col, {
        name: name,
        type: selectedType,
        config: {
          additional_context: additionalContext,
          keywords: [],
        },
        log: [],
      });

      router.push("/action_agents");
    } catch (error) {
      console.log("Failed with error: ", error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        rootPath="/action_agents"
        rootName="Action Agents"
        pageName="New"
      />

      <form>
        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your agent's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Type of Agent
              </label>

              <select
                id="type"
                value={selectedType}
                onChange={(type) => setSelectedType(type)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                {typeOptions.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Natural Language Guidance
            </label>
            <textarea
              rows={6}
              placeholder="Type your context."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>

          <button
            onClick={(e) => create_agent(e)}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Create Agent
          </button>
        </div>
      </form>
    </DefaultLayout>
  );
};
