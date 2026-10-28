import type { Metadata } from "next";
import Link from "next/link";

import { getT } from "@/lib/i18n/server";
import { addressLine, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getT();
  return lang === "es"
    ? {
        title: "Política de privacidad",
        description: `Cómo ${site.name} maneja la información recopilada en este sitio web.`,
      }
    : {
        title: "Privacy Policy",
        description: `How ${site.name} handles information collected through this website.`,
      };
}

/**
 * Written from what the site actually does rather than from a template: the
 * enquiry forms, the first-party visit counter, the saved-pieces list in the
 * browser, and the Meta and Google tags. If any of those change, this page is
 * the thing that has to change with them — in both languages.
 */
const UPDATED = "October 2026";
const UPDATED_ES = "octubre de 2026";

export default async function PrivacyPage() {
  const { lang } = await getT();
  return lang === "es" ? <PrivacyEs /> : <PrivacyEn />;
}

function PrivacyEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-serif text-4xl text-ink-900 sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-ink-600">
        Last updated {UPDATED}. This covers {site.name}&apos;s website.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="The short version">
          <p>
            We collect what you send us through a form, and we measure which pieces get
            looked at so we know what to stock. We don&apos;t sell your information to
            anyone. We do use Facebook and Google advertising tools, which means some
            information about your visit is shared with them — the sections below say
            exactly what.
          </p>
        </Section>

        <Section title="What you give us">
          <p>
            When you send an enquiry, ask about layaway, or ask us to find a piece, we
            collect the <strong>name, WhatsApp or phone number, email address</strong> (whichever
            you give) and{" "}
            <strong>message</strong> you type, along with which item you were looking at.
          </p>
          <p>
            We use it to reply to you, usually on WhatsApp, and to talk about the piece. It
            goes to our staff by email and to a private team notification channel. We keep
            enquiries so we can follow up and keep track of a conversation — ask us and we
            will delete yours.
          </p>
        </Section>

        <Section title="What we measure ourselves">
          <p>
            We count visits so we know which pieces people are interested in. We record the
            pages viewed, how long each was open, which item a page was about,
            whether you tapped a WhatsApp or call button, and whether you arrived from a search engine, a social network, an ad, or by typing
            the address in.
          </p>
          <p>
            This part uses <strong>no cookies</strong>. It uses a random session number held
            by your browser only until you close the tab, and it does not record your IP
            address or build a fingerprint of your device. If you arrive from a search
            engine we keep only the site&apos;s name, never the words you searched for.
          </p>
        </Section>

        <Section title="Saved pieces and language">
          <p>
            Tapping the heart on a listing saves it in your own browser&apos;s storage. That
            list stays on your device, is never sent to us, and clearing your browser data
            removes it. The language you pick is kept in a small cookie for that purpose only.
          </p>
        </Section>

        <Section title="Advertising: Facebook and Google">
          <p>
            We advertise on Facebook, Instagram and Google, and we use their measurement
            tools to see which ads actually bring people to the shop. These are the parts of
            this site that do use cookies.
          </p>
          <p>
            The <strong>Meta Pixel</strong> (Facebook) and the <strong>Google Ads tag</strong>{" "}
            record the pages you visit here and which items you open, so we can measure
            our ads and show them again to people who looked at a piece.
          </p>
          <p>
            When you send us an enquiry, we also report that to Meta from our own server so
            the count is accurate. That report includes your{" "}
            <strong>email address, phone number and name converted into a scrambled code
            (a one-way hash)</strong> that Meta can match against its own records but which
            cannot be turned back into your details, together with your IP address, browser
            type, and Facebook&apos;s own cookie identifiers if you have them.
          </p>
          <p>
            Meta and Google handle that information under their own policies, not ours. You
            can limit it through{" "}
            <a
              href="https://www.facebook.com/settings?tab=ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              your Facebook ad settings
            </a>{" "}
            and{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              Google&apos;s My Ad Center
            </a>
            , and most browsers can block these tags outright.
          </p>
        </Section>

        <Section title="Who else sees it">
          <p>
            The companies that run this site for us: our web host, our database provider,
            our image storage, and the services that deliver enquiry notifications to our
            team. They process information on our behalf and nothing more.
          </p>
          <p>
            <strong>We do not sell your personal information, and we never have.</strong> We
            share it only as described here, or where the law requires it.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Ask us for a copy of what we hold about you, or ask us to delete it — email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-gold-500 hover:underline"
              >
                {site.email}
              </a>
              .
            </li>
            <li>Turn on &ldquo;Do Not Track&rdquo; or a tracker blocker in your browser.</li>
            <li>Clear your browser&apos;s cookies and site data to reset everything above.</li>
            <li>Reply to any message from us asking us to stop contacting you, and we will.</li>
          </ul>
        </Section>

        <Section title="Children">
          <p>
            This site is meant for adults buying luxury goods. We
            don&apos;t knowingly collect information from anyone under 18. If you believe a
            child has sent us something, email us and we will remove it.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we change how any of this works, we will update this page and the date at
            the top. Significant changes will be obvious on the page rather than buried.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about any of this go to{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-gold-500 hover:underline"
            >
              {site.email}
            </a>{" "}
            or{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-gold-500 hover:underline"
            >
              {site.phone}
            </a>
            .
          </p>
          {addressLine && <p className="text-ink-600">{site.name}, {addressLine}</p>}
        </Section>
      </div>

      <div className="mt-12 border-t border-ink-200 pt-6">
        <Link href="/" className="text-sm font-semibold text-gold-500 hover:underline">
          ← Back to {site.name}
        </Link>
      </div>
    </div>
  );
}

function PrivacyEs() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-serif text-4xl text-ink-900 sm:text-5xl">Política de privacidad</h1>
      <p className="mt-3 text-ink-600">
        Última actualización: {UPDATED_ES}. Aplica al sitio web de {site.name}.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="En resumen">
          <p>
            Recopilamos lo que nos envías por un formulario y medimos qué piezas se miran
            para saber qué traer. No vendemos tu información a nadie. Sí usamos las
            herramientas de publicidad de Facebook y Google, por lo que cierta información
            de tu visita se comparte con ellas; las secciones de abajo explican exactamente
            cuál.
          </p>
        </Section>

        <Section title="Lo que nos das">
          <p>
            Cuando nos envías una consulta, preguntas por un apartado o nos pides buscar una
            pieza, recopilamos el <strong>nombre, número de WhatsApp o teléfono y correo</strong>{" "}
            (lo que nos des) y el <strong>mensaje</strong> que escribas, junto con la pieza que
            estabas viendo.
          </p>
          <p>
            Lo usamos para responderte, normalmente por WhatsApp, y para conversar sobre la
            pieza. Le llega a nuestro equipo por correo y por un canal privado de
            notificaciones. Guardamos las consultas para dar seguimiento a la conversación;
            pídenos que borremos la tuya y lo hacemos.
          </p>
        </Section>

        <Section title="Lo que medimos nosotros">
          <p>
            Contamos las visitas para saber qué piezas interesan. Registramos las páginas
            vistas, cuánto tiempo estuvo abierta cada una, a qué pieza correspondía, si
            tocaste un botón de WhatsApp o de llamada, y si llegaste desde un buscador, una
            red social, un anuncio o escribiendo la dirección.
          </p>
          <p>
            Esta parte <strong>no usa cookies</strong>. Usa un número de sesión aleatorio que
            tu navegador guarda solo hasta que cierras la pestaña, y no registra tu dirección
            IP ni crea una huella de tu dispositivo. Si llegas desde un buscador, solo
            guardamos el nombre del sitio, nunca las palabras que buscaste.
          </p>
        </Section>

        <Section title="Piezas guardadas e idioma">
          <p>
            Al tocar el corazón en una pieza, esta se guarda en el almacenamiento de tu propio
            navegador. Esa lista se queda en tu dispositivo, nunca se nos envía, y se borra al
            limpiar los datos del navegador. El idioma que eliges se guarda en una pequeña
            cookie con ese único fin.
          </p>
        </Section>

        <Section title="Publicidad: Facebook y Google">
          <p>
            Anunciamos en Facebook, Instagram y Google, y usamos sus herramientas de medición
            para saber qué anuncios realmente traen gente a la tienda. Estas son las partes
            del sitio que sí usan cookies.
          </p>
          <p>
            El <strong>Píxel de Meta</strong> (Facebook) y la <strong>etiqueta de Google Ads</strong>{" "}
            registran las páginas que visitas aquí y qué piezas abres, para medir nuestros
            anuncios y volver a mostrarlos a quienes vieron una pieza.
          </p>
          <p>
            Cuando nos envías una consulta, también se lo informamos a Meta desde nuestro
            propio servidor para que el conteo sea exacto. Ese reporte incluye tu{" "}
            <strong>correo, teléfono y nombre convertidos en un código cifrado (un hash de una
            sola vía)</strong> que Meta puede comparar con sus propios registros pero que no se
            puede revertir a tus datos, junto con tu dirección IP, tipo de navegador y los
            identificadores de cookies de Facebook, si los tienes.
          </p>
          <p>
            Meta y Google manejan esa información bajo sus propias políticas, no las nuestras.
            Puedes limitarla en{" "}
            <a
              href="https://www.facebook.com/settings?tab=ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              tu configuración de anuncios de Facebook
            </a>{" "}
            y en{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              el Centro de anuncios de Google
            </a>
            , y la mayoría de los navegadores pueden bloquear estas etiquetas por completo.
          </p>
        </Section>

        <Section title="Quién más la ve">
          <p>
            Las empresas que operan este sitio para nosotros: nuestro hosting, nuestro
            proveedor de base de datos, el almacenamiento de imágenes y los servicios que
            envían las notificaciones de consultas a nuestro equipo. Procesan la información
            en nuestro nombre y nada más.
          </p>
          <p>
            <strong>No vendemos tu información personal, y nunca lo hemos hecho.</strong> Solo
            la compartimos como se describe aquí, o cuando la ley lo exige.
          </p>
        </Section>

        <Section title="Tus opciones">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Pídenos una copia de lo que tenemos sobre ti, o que lo borremos, escribiendo a{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-gold-500 hover:underline"
              >
                {site.email}
              </a>
              .
            </li>
            <li>Activa &ldquo;No rastrear&rdquo; o un bloqueador de rastreo en tu navegador.</li>
            <li>Borra las cookies y los datos del sitio en tu navegador para reiniciar todo lo anterior.</li>
            <li>Responde a cualquier mensaje nuestro pidiendo que dejemos de contactarte, y lo haremos.</li>
          </ul>
        </Section>

        <Section title="Menores de edad">
          <p>
            Este sitio está dirigido a adultos que compran artículos de lujo. No recopilamos a
            sabiendas información de menores de 18 años. Si crees que un menor nos envió algo,
            escríbenos y lo eliminaremos.
          </p>
        </Section>

        <Section title="Cambios">
          <p>
            Si cambiamos algo de esto, actualizaremos esta página y la fecha de arriba. Los
            cambios importantes se verán claramente en la página, no escondidos.
          </p>
        </Section>

        <Section title="Contacto">
          <p>
            Las preguntas sobre esto van a{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-gold-500 hover:underline"
            >
              {site.email}
            </a>{" "}
            o al{" "}
            <a href={site.phoneHref} className="font-semibold text-gold-500 hover:underline">
              {site.phone}
            </a>
            .
          </p>
          {addressLine && <p className="text-ink-600">{site.name}, {addressLine}</p>}
        </Section>
      </div>

      <div className="mt-12 border-t border-ink-200 pt-6">
        <Link href="/" className="text-sm font-semibold text-gold-500 hover:underline">
          ← Volver a {site.name}
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{children}</div>
    </section>
  );
}
