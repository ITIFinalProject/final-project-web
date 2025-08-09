import "../styles/policies.css"

export default function Policies() {
    return (
        <div className="policies-container">
            <h1 className="policies-title">Event Policies</h1>
            <p className="policies-intro">
                Welcome to our platform! By creating or participating in events, you agree to follow our guidelines.
                Please read this page carefully to avoid any violations.
            </p>

            <section className="policy-section">
                <h2>1. General Rules</h2>
                <ul>
                    <li>Events must comply with all local laws and regulations.</li>
                    <li>All event details must be accurate and truthful.</li>
                    <li>Respect the rights and privacy of all participants.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h2>2. Prohibited Content</h2>
                <ul>
                    <li>No hate speech, harassment, or discriminatory content.</li>
                    <li>No promotion of illegal activities or substances.</li>
                    <li>No violent, explicit, or dangerous content.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h2>3. Consequences of Violations</h2>
                <p>
                    If your event violates our policies, it may be removed without notice.
                    Repeated or severe violations may result in account suspension or permanent ban.
                </p>
            </section>

            <section className="policy-section">
                <h2>4. Reporting Violations</h2>
                <p>
                    If you see an event that violates our policies, please report us immediately 
                    {/* at:
                    <a href="mailto:support@example.com"> support@example.com</a> */}
                </p>
            </section>

            <footer className="policies-footer">
                <p>Last updated: August 2025</p>
            </footer>
        </div>
    );
}
