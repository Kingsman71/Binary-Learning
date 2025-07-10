"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { CounselorApplicationDetails } from "@/components/counselor-application-details";
import { programs } from "@/lib/data";

// Define the application type to include id and Firestore data
interface Application {
  id: string;
  [key: string]: any;
}

export default function CounselorApplicationDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No application ID provided");
      setLoading(false);
      return;
    }
    async function fetchApplication() {
      setLoading(true);
      setError("");
      try {
        console.debug(`[Firestore] Fetching application with ID: ${id}`);
        const docRef = doc(db, "applications", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApplication({ id: docSnap.id, ...docSnap.data() });
          console.debug("[Firestore] Application data:", docSnap.data());
        } else {
          setError("Application not found");
          console.warn(`[Firestore] No application found for ID: ${id}`);
        }
      } catch (err) {
        setError("Failed to fetch application");
        console.error("[Firestore] Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplication();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading application...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!application) {
    return null;
  }

  // Convert Firestore Timestamp to JS Date if needed
  let applicationDate = application.applicationDate;
  if (applicationDate && typeof applicationDate === "object" && applicationDate.seconds) {
    applicationDate = new Date(applicationDate.seconds * 1000);
  }

  // Find the program and other programs
  const program = programs.find((p) => p.id === application.programId);
  const otherPrograms = programs.filter((p) => p.id !== application.programId);

  // Build a fully-typed Application object for the UI component
  const applicationForComponent = {
    id: application.id,
    applicant: application.applicant || { fullName: '', email: '', phone: '' },
    programId: application.programId || '',
    programTitle: application.programTitle || (program ? program.title : ''),
    applicationDate: applicationDate || new Date(),
    status: application.status || 'Pending Review',
    education: application.education || { highestQualification: '', fieldOfStudy: '', institution: '' },
    statementOfPurpose: application.statementOfPurpose || '',
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {program ? (
            <CounselorApplicationDetails
              application={applicationForComponent}
              program={program}
              otherPrograms={otherPrograms}
            />
          ) : (
            <div className="text-red-500">Program not found.</div>
          )}
    </div>
  );
}
