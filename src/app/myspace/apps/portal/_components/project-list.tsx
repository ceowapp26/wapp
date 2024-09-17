import React, { useMemo } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { FileCode } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Item } from "./code-item";
import { motion, AnimatePresence } from 'framer-motion';
import { usePortalContext } from '@/context/portal-context-provider';

interface ProjectListProps {
  level?: number;
}

export const ProjectList: React.FC<ProjectListProps> = ({ level = 0 }) => {
  const params = useParams();
  const router = useRouter();
  const { setActiveProject } = usePortalContext();
  const projects = useQuery(api.codes.getProjectList);

  const items = useMemo(() => projects || [], [projects]);

  const onRedirect = (projectId: string) => {
    setActiveProject(projectId);
    router.push(`/myspace/apps/portal/code/${projectId}`);
  };

  if (!projects) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <AnimatePresence>
      {items.map((project) => (
        <motion.div
          key={project._id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Item
            id={project._id}
            label={project.projectName}
            icon={FileCode}
            active={params.projectId === project._id}
            level={level}
            language={project.development.language}
            onClick={() => onRedirect(project._id)}
            isCode
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};