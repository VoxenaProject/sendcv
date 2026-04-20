import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-lg font-black">send</span><span className="text-lg font-black text-indigo-600">cv</span><span className="text-[8px] text-gray-300">.ai</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-12 text-sm text-gray-600 leading-relaxed">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Mentions légales, CGV & Politique de confidentialité</h1>
          <p className="text-xs text-gray-400">Dernière mise à jour : 20 avril 2026</p>
        </div>

        <Section title="1. Mentions légales">
          <p><strong>Éditeur :</strong> SendCV.ai — Service édité par SYNAPZ, agence IA basée en Belgique.</p>
          <p><strong>Responsable de publication :</strong> Dejvi Prifti</p>
          <p><strong>Contact :</strong> contact@sendcv.ai</p>
          <p><strong>Hébergement :</strong> Vercel Inc. (San Francisco, CA) — Infrastructure européenne via AWS EU (Francfort).</p>
          <p><strong>Base de données :</strong> Supabase — Données hébergées en Union Européenne.</p>
        </Section>

        <Section title="2. Conditions générales de vente (CGV)">
          <h3 className="font-bold text-gray-800 mt-4">2.1 Objet</h3>
          <p>SendCV.ai fournit un service de génération de documents de candidature (CV, lettres de motivation, préparations d&apos;entretien) assistée par intelligence artificielle. L&apos;accès au service nécessite la création d&apos;un compte et l&apos;achat de crédits.</p>

          <h3 className="font-bold text-gray-800 mt-4">2.2 Crédits</h3>
          <p>Les crédits sont achetés par packs (Starter : 3 crédits / 19€, Pro : 10 crédits / 49€, Ultra : 30 crédits / 99€). 1 crédit = 1 candidature complète (CV + lettre + préparation entretien + tips LinkedIn). Les crédits n&apos;expirent pas. Les crédits ne sont pas transférables.</p>

          <h3 className="font-bold text-gray-800 mt-4">2.3 Garantie Entretien 30 Jours</h3>
          <p>Si l&apos;utilisateur envoie au moins 10 candidatures générées via SendCV.ai dans les 30 jours suivant son premier achat et n&apos;obtient aucun entretien, un remboursement complet du pack acheté est accordé sur simple demande par email à contact@sendcv.ai. Cette garantie s&apos;applique au premier pack acheté uniquement.</p>

          <h3 className="font-bold text-gray-800 mt-4">2.4 Droit de rétractation</h3>
          <p>Conformément à la législation européenne, l&apos;utilisateur dispose d&apos;un droit de rétractation de 14 jours à compter de l&apos;achat, sauf si les crédits ont déjà été utilisés (service numérique consommé).</p>

          <h3 className="font-bold text-gray-800 mt-4">2.5 Paiement</h3>
          <p>Les paiements sont traités par Stripe. SendCV.ai n&apos;a jamais accès aux données de carte bancaire. Tous les prix sont indiqués en euros TTC.</p>
        </Section>

        <Section title="3. Politique de confidentialité (RGPD)">
          <h3 className="font-bold text-gray-800 mt-4">3.1 Données collectées</h3>
          <p>Nous collectons : nom, adresse email, données de profil professionnel (expérience, formation, compétences, langues) saisies volontairement par l&apos;utilisateur, et les offres d&apos;emploi analysées.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.2 Finalité</h3>
          <p>Les données sont utilisées exclusivement pour générer les documents de candidature et améliorer le service. Aucune donnée n&apos;est vendue à des tiers.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.3 Traitement par IA</h3>
          <p>Les données de profil et les offres d&apos;emploi sont envoyées à l&apos;API Claude d&apos;Anthropic pour la génération de contenu. Anthropic ne conserve pas les données des requêtes API au-delà du traitement. Voir la politique de confidentialité d&apos;Anthropic pour plus de détails.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.4 Hébergement</h3>
          <p>Les données sont hébergées dans l&apos;Union Européenne (Supabase, région EU). Les sauvegardes sont chiffrées.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.5 Durée de conservation</h3>
          <p>Les données sont conservées tant que le compte est actif. Après suppression du compte, toutes les données sont effacées sous 30 jours.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.6 Droits de l&apos;utilisateur</h3>
          <p>Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, portabilité, limitation et opposition au traitement de vos données. Pour exercer ces droits, contactez contact@sendcv.ai.</p>

          <h3 className="font-bold text-gray-800 mt-4">3.7 Cookies</h3>
          <p>SendCV.ai utilise uniquement des cookies essentiels au fonctionnement du service (authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.</p>
        </Section>

        <Section title="4. Propriété intellectuelle">
          <p>Le contenu généré par l&apos;IA appartient à l&apos;utilisateur. SendCV.ai ne revendique aucun droit sur les CV, lettres de motivation ou autres documents générés. L&apos;utilisateur est libre de les utiliser, modifier et distribuer comme il le souhaite.</p>
        </Section>

        <Section title="5. Limitation de responsabilité">
          <p>SendCV.ai fournit un outil d&apos;aide à la candidature. Les résultats dépendent de la qualité des informations fournies par l&apos;utilisateur et des critères des recruteurs. SendCV.ai ne garantit pas l&apos;obtention d&apos;un emploi. La garantie entretien 30 jours est soumise aux conditions décrites en section 2.3.</p>
        </Section>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">Pour toute question : contact@sendcv.ai</p>
          <Link href="/" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">← Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
