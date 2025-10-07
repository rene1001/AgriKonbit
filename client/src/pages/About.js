import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section: Pourquoi investir */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Pourquoi investir avec Agri Konbit ?</h1>
          <p className="text-primary-700 font-semibold mb-4">Votre engagement pour un changement durable</p>
          <p className="text-gray-700 leading-relaxed">
            Agri Konbit est bien plus qu’une plateforme d’investissement : c’est un mouvement collectif pour la renaissance de l’agriculture haïtienne.
            En investissant avec nous, vous soutenez des initiatives concrètes qui créent des emplois, renforcent la sécurité alimentaire et protègent notre environnement.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Impact mesurable</h3>
              <p className="text-gray-700">Chaque investissement améliore directement les revenus des agriculteurs et réduit la dépendance alimentaire du pays.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Transparence totale</h3>
              <p className="text-gray-700">Grâce à notre tableau de bord numérique, vous suivez l’évolution de chaque projet et l’utilisation de vos fonds.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Approche collaborative</h3>
              <p className="text-gray-700">Inspiré du concept traditionnel du konbit, notre modèle repose sur le travail collectif et l’implication active des communautés locales.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Projets durables</h3>
              <p className="text-gray-700">Nous promouvons l’agroécologie, la gestion responsable des ressources et des pratiques respectueuses de la nature.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Accès aux marchés</h3>
              <p className="text-gray-700">Nous relions les producteurs aux acheteurs locaux et internationaux, assurant des débouchés stables et équitables.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Soutien technique</h3>
              <p className="text-gray-700">Nos agronomes et experts accompagnent les bénéficiaires pour garantir la réussite et la pérennité de chaque projet.</p>
            </div>
          </div>
        </section>

        {/* Section: Nos projets */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nos projets</h2>
          <p className="text-primary-700 font-semibold mb-4">Transformer l’agriculture, la pêche et l’élevage</p>
          <p className="text-gray-700 leading-relaxed">
            Agri Konbit soutient des projets pilotes qui dynamisent les secteurs clés de l’économie rurale haïtienne. Des fermes agroécologiques aux coopératives de pêche,
            chaque investissement contribue à bâtir un Haïti autosuffisant, prospère et tourné vers l’avenir.
          </p>
        </section>

        {/* Section: Notre vision */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Notre vision</h2>
          <p className="text-primary-700 font-semibold mb-4">Bâtir un avenir résilient et prospère</p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nous rêvons d’un Haïti où chaque communauté rurale prospère grâce à une agriculture durable et inclusive. Notre vision repose sur l’innovation, la collaboration et
            l’autonomisation des producteurs pour construire un pays autosuffisant et fier de son potentiel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Autonomisation</h3>
              <p className="text-gray-700">Donner aux agriculteurs, pêcheurs et éleveurs les moyens de réussir.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Durabilité</h3>
              <p className="text-gray-700">Préserver les terres, les mers et les ressources naturelles du pays.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Inclusion</h3>
              <p className="text-gray-700">Placer les communautés locales et la diaspora au cœur de chaque projet.</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Prospérité</h3>
              <p className="text-gray-700">Stimuler la croissance économique et renforcer la sécurité alimentaire nationale.</p>
            </div>
          </div>
        </section>

        {/* Section: Comment investir ? */}
        <section className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Comment investir ?</h2>
          <p className="text-primary-700 font-semibold mb-4">Investissez dans l’avenir d’Haïti</p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Rejoignez Agri Konbit et participez activement à la transformation durable de l’agriculture, de la pêche et de l’élevage en Haïti.
            Que vous soyez un particulier, une entreprise ou une organisation, votre investissement finance des projets concrets qui changent des vies.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><span className="font-medium">Choisissez un projet :</span> Explorez notre catalogue de projets agricoles, piscicoles ou d’élevage et sélectionnez celui qui vous inspire.</li>
            <li><span className="font-medium">Investissez facilement :</span> Utilisez notre plateforme sécurisée pour investir via un don, un prêt ou une prise de participation.</li>
            <li><span className="font-medium">Suivez votre impact :</span> Consultez en temps réel les rapports d’avancement et l’utilisation de vos fonds.</li>
            <li><span className="font-medium">Participez à la vision :</span> Devenez un acteur du changement et contribuez à bâtir le pays que nous voulons vivre.</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default About;
