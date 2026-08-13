"use client";

import { Dialog } from "@base-ui/react/dialog";
import { SectionHeader } from "@/components/ui";

interface ProjectPlaceholder {
  readonly id: string;
  readonly description: string;
}

const PROJECTS: readonly ProjectPlaceholder[] = [
  {
    id: "01",
    description:
      "Project identity, role, architecture, verification, screenshot, and result are not yet approved.",
  },
  {
    id: "02",
    description: "No client, metric, date, repository, demo, or outcome is inferred.",
  },
  {
    id: "03",
    description:
      "Stable layout is available for review; production authenticity gate remains closed.",
  },
];

const projectDialog = Dialog.createHandle<ProjectPlaceholder>();

export function ProjectRegister() {
  return (
    <section
      id="projects"
      className="content-section projects-section"
      aria-labelledby="projects-title"
      data-observed-section="projects"
    >
      <SectionHeader
        id="projects-title"
        title="Projects"
        summary="Production publication remains blocked until owner-approved evidence replaces these explicit review placeholders."
      />
      <div className="project-register">
        {PROJECTS.map((project) => (
          <article className="project-row" key={project.id}>
            <span className="project-index">{project.id}</span>
            <div>
              <h3>Content pending owner evidence</h3>
              <p>{project.description}</p>
            </div>
            <Dialog.Trigger
              className="project-inspect-trigger"
              handle={projectDialog}
              payload={project}
            >
              Inspect placeholder
            </Dialog.Trigger>
          </article>
        ))}
      </div>
      <Dialog.Root handle={projectDialog} disablePointerDismissal>
        {({ payload }) => (
          <Dialog.Portal>
            <Dialog.Backdrop className="project-dialog-backdrop" />
            <Dialog.Viewport className="project-dialog-viewport">
              <Dialog.Popup className="project-dialog">
                <div className="dialog-header">
                  <span>Evidence inspection</span>
                  <Dialog.Close className="dialog-close" aria-label="Close project inspection">
                    Close
                  </Dialog.Close>
                </div>
                <Dialog.Title>Project evidence pending</Dialog.Title>
                <Dialog.Description>
                  Placeholder {payload?.id ?? ""}: this local state proves the dialog layout without
                  inventing a project record.
                </Dialog.Description>
                <dl>
                  <div>
                    <dt>Required</dt>
                    <dd>
                      Problem, role, architecture, decision, stack, testing, screenshot, verified
                      result.
                    </dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Blocked until owner-approved evidence is supplied.</dd>
                  </div>
                </dl>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </section>
  );
}
