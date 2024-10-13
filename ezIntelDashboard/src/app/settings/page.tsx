"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { use, useEffect, useState } from "react";

export default () => {
  const [id, setId] = useState("");
  const [link, setLink] = useState("");
  const [context, setContext] = useState("");
  const [performance, setPerformance] = useState("");

  const save = () => {
    if (!link || !context || !performance) {
      alert("Please fill all fields");
      return;
    }

    if (link.length < 3) {
      alert("Link must be at least 3 characters long");
      return;
    }

    if (context.length < 5) {
      alert("Please provide sufficient additional context.");
      return;
    }

    if (performance.length < 5) {
      alert("Please provide sufficient performance context.");
      return;
    }

    const ref = doc(db, "settings", id);
    setDoc(ref, {
      link: link,
      context: context,
      performance: performance,
    });
  };

  useEffect(() => {
    const fetchTask = async () => {
      // const ref = doc(db, "tasks", id);
      // const snapshot = await getDoc(ref);
      // setTask({ id: snapshot.id, ...snapshot.data() });
      const l = query(collection(db, "settings"), limit(1));

      const snapshot = await getDocs(l);

      if (snapshot.empty) {
        const col = collection(db, "settings");
        try {
          let ref = await addDoc(col, {
            link: link,
            context: context,
            performance: performance,
          });

          setId(ref.id);
        } catch (error) {
          console.log("Failed with error: ", error);
        }
      } else {
        snapshot.forEach((doc) => {
          let data = doc.data();
          let id = doc.id;

          setId(id);
          setLink(data.link);
          setContext(data.context);
          setPerformance(data.performance);
          console.log(data);
        });
      }
    };
    fetchTask();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb rootName=" " rootPath="/settings" pageName="Settings" />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Company Information
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="emailAddress"
                >
                  Link to site
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="email"
                    name="emailAddress"
                    id="emailAddress"
                    placeholder="https://ezml.io"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5.5">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="Username"
                >
                  Additional Context
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="bio"
                    id="bio"
                    rows={6}
                    placeholder="Write additional context about your products, services, and target audience."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="mb-5.5">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="Username"
                >
                  Prior Site Performance
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="bio"
                    id="bio"
                    rows={6}
                    placeholder="Add information about your current site and content marketing performance."
                    value={performance}
                    onChange={(e) => setPerformance(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  onClick={save}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
