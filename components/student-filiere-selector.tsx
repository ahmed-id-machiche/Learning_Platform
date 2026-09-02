"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Edit2 } from "lucide-react";
import axios from "axios";

import { StudentFiliereModal } from "@/components/modals/student-filiere-modal";
import { OFPPT_FILIERES } from "@/lib/ofppt-constants";

interface StudentFiliereSelectorProps {
  initialProfile?: {
    year: string;
    filiere: string;
  } | null;
}

export const StudentFiliereSelector = ({
  initialProfile,
}: StudentFiliereSelectorProps) => {
  const [profile, setProfile] = useState<{ year: string; filiere: string } | null>(
    initialProfile || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        if (res.data) {
          setProfile({ year: res.data.year, filiere: res.data.filiere });
        }
      } catch (error) {
        console.error("Failed to load student profile:", error);
      } finally {
        setHasLoaded(true);
      }
    };

    if (initialProfile !== undefined) {
      setProfile(initialProfile);
      setHasLoaded(true);
    } else {
      fetchProfile();
    }
  }, [initialProfile]);

  // Open modal automatically if user logged in but has no profile set yet
  useEffect(() => {
    if (hasLoaded && !profile) {
      setIsOpen(true);
    }
  }, [hasLoaded, profile]);

  const matchedFiliereObj = OFPPT_FILIERES.find(
    (f) => f.value === profile?.filiere
  );

  const displayLabel = matchedFiliereObj
    ? `${profile?.year} • ${matchedFiliereObj.shortName}`
    : profile
    ? `${profile.year} • ${profile.filiere}`
    : "Sélectionner mon Année & Filière";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-900 border border-purple-200/90 transition-all text-xs font-bold group shadow-2xs"
        title="Changer d'année ou de filière"
      >
        <div className="p-1 rounded-lg bg-purple-700 text-white group-hover:scale-105 transition-transform">
          <GraduationCap className="h-3.5 w-3.5" />
        </div>
        <span className="max-w-[170px] sm:max-w-[240px] truncate">
          {displayLabel}
        </span>
        <Edit2 className="h-3 w-3 text-purple-500 opacity-75 group-hover:opacity-100 ml-0.5" />
      </button>

      <StudentFiliereModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialProfile={profile}
        forceOnboarding={!profile}
      />
    </>
  );
};
