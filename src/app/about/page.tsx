export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About ProdTrix</h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              ProdTrix is a study-focused platform designed for outcome-based
              project and workflow management. We empower students,
              supervisors, and administrators to collaborate effectively on
              Progress.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Comprehensive thesis management system</li>
              <li>Student collaboration and group formation tools</li>
              <li>Document upload and tracking system</li>
              <li>Semester and academic calendar management</li>
              <li> workflow for  work</li>
              <li>Real-time feedback and comments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <p>
              Students can form thesis groups, collaborate with peers, submit
              documents, track their progress, and communicate directly with
              peers and anyone over the net.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For Supervisors</h2>
            <p>
              Supervisors manage their assigned thesis groups, review student
              submissions, provide feedback, and monitor progress
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For Administrators</h2>
            <p>
              Administrators oversee the entire thesis management process,
              create semesters, manage groups, handle approval workflows, and
              generate reports.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
