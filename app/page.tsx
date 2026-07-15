import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { HeroSignalAnimation } from "./HeroSignalAnimation";
import { PageMotion } from "./PageMotion";
import { ReportWheel } from "./ReportWheel";

export const metadata: Metadata = {
  title: "CogniThread | Synchronized cognitive rehabilitation",
  description:
    "A research prototype that brings wearable EEG and therapist-recorded behaviour into one synchronized view for cognitive rehabilitation.",
};

const signals = [
  { label: "EEG", detail: "Delta, Theta, Alpha, Beta and Gamma bands" },
  { label: "Behaviour", detail: "Correct, incorrect and no-response events" },
  { label: "Timing", detail: "Task accuracy and reaction time by prompt" },
  { label: "Progress", detail: "Longitudinal summaries across sessions" },
];

const workflow = [
  {
    number: "01",
    title: "Wear",
    copy: "A lightweight four-channel headband captures EEG activity during a therapist-led session.",
  },
  {
    number: "02",
    title: "Respond",
    copy: "A tactile button unit records task outcomes instantly, without interrupting the activity.",
  },
  {
    number: "03",
    title: "Synchronize",
    copy: "Bluetooth Low Energy aligns EEG and behavioural events on a shared timeline.",
  },
  {
    number: "04",
    title: "Review",
    copy: "A therapist-friendly dashboard turns each session into readable, comparable progress metrics.",
  },
];

const softwareFlow = [
  {
    number: "01",
    tag: "Patient access",
    title: "Start the session",
    copy: "The participant signs in to a simple, guided session prepared for community rehabilitation.",
    image: "/software-patient-login.jpg",
    alt: "CogniThread patient session login screen",
  },
  {
    number: "02",
    tag: "Device setup",
    title: "Connect the SenzeBand",
    copy: "The therapist scans for the headband, connects it and checks all four EEG contacts.",
    image: "/software-device-setup.jpg",
    alt: "CogniThread SenzeBand device connection and signal quality screen",
  },
  {
    number: "03",
    tag: "Video selection",
    title: "Select a video to play",
    copy: "The therapist selects a video session to play before starting the experiment.",
    image: "/software-video-selection.png",
    alt: "CogniThread dashboard showing selectable rehabilitation video sessions before the experiment",
  },
];

export default function Home() {
  return (
    <PageMotion>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CogniThread home">
          <img className="brand-logo" src="/cognithread-logo.png" alt="CogniThread" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#why">Why</a>
          <a href="#system">System</a>
          <a href="#software">Software</a>
          <a href="#evidence">Evidence</a>
        </nav>
        <a className="nav-cta" href="#poster">View project</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Wearable EEG × real-time behavioural assessment</p>
          <h1>Rehabilitation signals, finally moving together.</h1>
          <p className="hero-intro">
            CogniThread synchronizes brain activity and therapist-recorded responses
            to make cognitive rehabilitation progress easier to capture, compare and understand.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#system">Explore the system</a>
            <a className="button button-ghost" href="#evidence">See project evidence <span>↗</span></a>
          </div>
        </div>

        <HeroSignalAnimation />

      </section>

      <section className="section problem-section" id="why" data-motion-section>
        <div className="section-index" data-reveal>01 / Why</div>
        <div className="problem-heading" data-reveal>
          <p className="eyebrow dark">Two signals. One missing context.</p>
          <h2>Rehabilitation creates more than one kind of signal.</h2>
        </div>
        <div className="problem-copy" data-reveal>
          <p>
            Existing EEG systems can show neurophysiological activity, while therapists
            separately observe task performance. When these records are not synchronized,
            the context behind a signal can be difficult to recover.
          </p>
          <p>
            CogniThread bridges that gap with a low-cost, dual-modal platform built for
            community-based cognitive rehabilitation—particularly for older adults with sight loss.
          </p>
        </div>
        <figure className="generated-visual problem-generated-visual" data-reveal>
          <img
            className="generated-visual-image"
            src="/why-rehabilitation-generated.png"
            alt="Older adult completing a rehabilitation task with a therapist while wearing the SenzeBand"
          />
          <span className="generated-visual-sweep" aria-hidden="true" />
          <figcaption><span>Community session</span><strong>Signals captured inside real rehabilitation practice</strong></figcaption>
        </figure>
        <div className="problem-signal-board" data-reveal>
          <article className="problem-source eeg-source">
            <span>Signal 01 / EEG</span>
            <strong>Brain activity</strong>
            <div className="source-wave" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
          </article>
          <article className="problem-source behaviour-source">
            <span>Signal 02 / Behaviour</span>
            <strong>Task response</strong>
            <div className="event-sequence" aria-hidden="true"><i /><i /><i /><i /></div>
          </article>
          <div className="context-output">
            <span>Synchronized context</span>
            <strong>One moment, understood as a whole.</strong>
            <p>Objective brain signals become useful inside the human rhythm of rehabilitation.</p>
          </div>
        </div>
      </section>

      <section className="section workflow-section" id="system" data-motion-section>
        <div className="section-index light" data-reveal>02 / System</div>
        <div className="workflow-intro" data-reveal>
          <p className="eyebrow">One session. One shared timeline.</p>
          <h2>From headband to insight—without adding friction.</h2>
        </div>
        <div className="system-live-strip" data-reveal>
          <span><i className="capture-status-dot" /> Live dual-modal session</span>
          <strong>EEG + therapist response</strong>
          <em>09:42:18</em>
        </div>
        <figure className="generated-visual system-generated-visual" data-reveal>
          <img
            className="generated-visual-image"
            src="/system-ecosystem-generated.png"
            alt="SenzeBand, therapist response controller and session dashboard connected as one system"
          />
          <span className="generated-visual-sweep" aria-hidden="true" />
          <figcaption><span>Connected ecosystem</span><strong>Headband → response unit → therapist dashboard</strong></figcaption>
        </figure>
        <div className="workflow-grid">
          {workflow.map((step) => (
            <article className={`workflow-step workflow-step-${step.number}`} key={step.number} data-reveal>
              <div className="workflow-step-top"><span>{step.number}</span><em>SESSION FLOW</em></div>
              <div className="workflow-visual" aria-hidden="true">
                {step.number === "01" && <img src="/senzeband-headband.png" alt="" />}
                {step.number === "02" && <div className="response-control"><i /><i /><i /></div>}
                {step.number === "03" && (
                  <div className="sync-visual">
                    <span className="sync-line-label sync-line-label-raw">RAW EEG</span>
                    <span className="sync-line-label sync-line-label-behaviour">BEHAVIOUR</span>
                    <svg viewBox="0 0 300 120" preserveAspectRatio="none">
                      <path className="sync-data-path sync-data-path-raw" d="M0 24L12 20L24 29L36 17L48 25L60 18L72 31L84 19L96 25L110 24C126 24 132 60 148 60" />
                      <path className="sync-data-path sync-data-path-behaviour" d="M0 96H24V78H48V96H73V70H97V96H110C126 96 132 60 148 60" />
                      <path className="sync-data-path sync-data-path-output" d="M166 60L180 55L192 66L205 50L218 62L232 54L246 68L260 52L274 61L288 56L300 60" />
                    </svg>
                    <strong className="sync-merge-core">SYNC</strong>
                    <span className="sync-output-label">ALIGNED DATA</span>
                  </div>
                )}
                {step.number === "04" && <img src="/software-signal-ready.jpg" alt="" />}
              </div>
              <div className="workflow-step-copy"><h3>{step.title}</h3><p>{step.copy}</p></div>
            </article>
          ))}
        </div>
        <div className="system-signal-rail" data-reveal aria-hidden="true">
          <span>WEARABLE EEG</span>
          <div />
          <strong>TIME-ALIGNED SESSION</strong>
          <div />
          <span>THERAPIST VIEW</span>
          <i className="system-travel-dot" />
        </div>
      </section>

      <section className="section software-section" id="software" aria-labelledby="software-title">
        <div className="section-index">03 / Software journey</div>
        <div className="software-heading">
          <p className="eyebrow dark">One guided path</p>
          <h2 id="software-title">The software keeps every step connected.</h2>
          <p>
            From patient access to a verified EEG stream, each screen gives the therapist
            one clear action and carries the session forward.
          </p>
        </div>
        <div className="software-flow-track">
          {softwareFlow.map((step) => (
            <article className="software-step" key={step.number}>
              <div className="software-step-heading">
                <span>{step.number} / {step.tag}</span>
                <h3>{step.title}</h3>
              </div>
              <div className="software-screen">
                <img src={step.image} alt={step.alt} />
              </div>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section capture-section" data-motion-section>
        <div className="section-index" data-reveal>04 / What it captures</div>
        <div className="capture-heading" data-reveal>
          <p className="eyebrow dark">Complementary data</p>
          <h2>Designed to preserve the context behind every response.</h2>
        </div>
        <figure className="generated-visual capture-generated-visual" data-reveal>
          <img
            className="generated-visual-image"
            src="/capture-signals-generated.png"
            alt="Abstract visualization of aligned EEG, behaviour, timing and progress signals"
          />
          <span className="generated-visual-sweep" aria-hidden="true" />
          <figcaption><span>Aligned session</span><strong>Brain activity and behavioural events share one timeline</strong></figcaption>
        </figure>
        <div className="capture-grid">
          {signals.map((signal, index) => (
            <article className={`capture-card capture-card-${index + 1}`} key={signal.label} data-reveal>
              <div className="capture-card-top"><span>0{index + 1}</span><em>LIVE INPUT</em></div>
              <h3>{signal.label}</h3>
              <p>{signal.detail}</p>
              <div className="capture-bands" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </article>
          ))}
        </div>
        <article className="facial-classifier-panel" data-reveal>
          <figure className="generated-visual facial-classifier-visual">
            <img
              className="generated-visual-image"
              src="/facial-classifier-generated.png"
              alt="Facial expression classifier adding session-level behavioural context during a tablet task"
            />
            <span className="generated-visual-sweep" aria-hidden="true" />
          </figure>
          <div className="facial-classifier-copy">
            <p className="eyebrow dark">Facial classifier</p>
            <h3>One more behavioural signal, interpreted in context.</h3>
            <p>
              A camera-based classifier groups visible facial cues into simple session-level
              states, helping therapists review engagement alongside EEG and task responses.
              It supports behavioural context; it is not used for identity recognition or diagnosis.
            </p>
            <div className="classifier-confidence" aria-label="Example classifier states">
              <span>Attentive <i style={{ "--confidence": ".82" } as CSSProperties} /></span>
              <span>Neutral <i style={{ "--confidence": ".61" } as CSSProperties} /></span>
              <span>Uncertain <i style={{ "--confidence": ".28" } as CSSProperties} /></span>
            </div>
          </div>
        </article>
      </section>

      <section className="section evidence-section" id="evidence">
        <div className="section-index light">05 / Evidence</div>
        <div className="evidence-copy">
          <p className="eyebrow">Prototype outputs</p>
          <h2>A clearer longitudinal story for therapists.</h2>
          <p>
            The prototype produces time-aligned CSV records, task-linked EEG segments and
            per-user summaries. A synthetic demonstration report shows how multiple sessions
            can be reviewed as one coherent timeline; its values are illustrative, not clinical evidence.
          </p>
          <div className="metric-row">
            <div><strong>4</strong><span>EEG channels</span></div>
            <div><strong>2</strong><span>aligned data streams</span></div>
            <div><strong>1</strong><span>therapist-ready view</span></div>
          </div>
        </div>
        <ReportWheel />
      </section>

      <section className="section poster-section" id="poster">
        <div className="poster-frame">
          <img src="/research-poster.png" alt="Research poster for the synchronized wearable EEG project" />
        </div>
        <div className="poster-copy">
          <div className="section-index">06 / Research poster</div>
          <p className="eyebrow dark">Built, tested, presented</p>
          <h2>See the full project story.</h2>
          <p>
            Explore the original project poster for the challenge, objective, hardware and software
            methodology, prototype interface and preliminary task-linked observations.
          </p>
          <a className="button button-dark" href="/research-poster.png" target="_blank" rel="noreferrer">
            Open full poster <span>↗</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img className="brand-logo footer-logo" src="/cognithread-logo.png" alt="CogniThread" />
          <span className="footer-tagline">Signals in context.</span>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
    </PageMotion>
  );
}
