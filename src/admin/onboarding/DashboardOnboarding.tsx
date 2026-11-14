import { useCallback, useEffect, useRef } from "react"
import { driver, type Driver } from "driver.js"
import "driver.js/dist/driver.css"

import { Btn, useToast } from "@/admin/ui"

type DashboardOnboardingProps = {
  userId: string
  ready: boolean
}

const STORAGE_KEY = "hj-dashboard-tour"
const TOUR_VERSION = "v1"

/**
 * Tour guiado do Painel (driver.js). Abre sozinho na primeira visita de cada
 * utilizador e pode ser repetido no botão «Conhecer o painel».
 *
 * A API do Higino já tem as tabelas de onboarding, mas ainda não expõe
 * rotas; por isso o estado fica guardado no navegador.
 */
const STEPS = [
  {
    element: '[data-tour="dashboard-welcome"]',
    popover: {
      title: "Bem-vindo ao painel",
      description:
        "Este é o ponto de partida para gerir o conteúdo do portfólio.",
      side: "bottom" as const,
    },
  },
  {
    element: '[data-tour="dashboard-import"]',
    popover: {
      title: "Importe o conteúdo existente",
      description:
        "Se as secções estiverem vazias, pode copiar para aqui o conteúdo que o site já mostra.",
      side: "bottom" as const,
    },
  },
  {
    element: '[data-tour="dashboard-resources"]',
    popover: {
      title: "Aceda às secções",
      description:
        "Os cartões mostram a quantidade de registos e abrem cada área para edição.",
      side: "bottom" as const,
    },
  },
  {
    element: '[data-tour="dashboard-activity"]',
    popover: {
      title: "Acompanhe a atividade",
      description:
        "Aqui encontra os conteúdos alterados recentemente e pode abri-los diretamente.",
      side: "top" as const,
    },
  },
  {
    element: '[data-tour="dashboard-actions"]',
    popover: {
      title: "Comece pelas ações rápidas",
      description:
        "Atalhos para editar o perfil e adicionar estratégias, negócios, eventos ou marcos do percurso.",
      side: "left" as const,
    },
  },
  {
    element: '[data-tour="dashboard-site"]',
    popover: {
      title: "Veja o resultado no site",
      description: "Abra o site numa nova aba para conferir as alterações.",
      side: "bottom" as const,
    },
  },
]

export function DashboardOnboarding({
  userId,
  ready,
}: DashboardOnboardingProps) {
  const toast = useToast()
  const driverRef = useRef<Driver | null>(null)
  const storageKey = `${STORAGE_KEY}:${userId}:${TOUR_VERSION}`

  const startTour = useCallback(() => {
    driverRef.current?.destroy()
    driverRef.current = driver({
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      allowClose: true,
      smoothScroll: true,
      skipMissingElement: true,
      nextBtnText: "Seguinte",
      prevBtnText: "Anterior",
      doneBtnText: "Concluir",
      closeBtnLabel: "Fechar",
      steps: STEPS,
      onDestroyed: (_el, _step, { reason }) => {
        if (reason === "replaced" || reason === "api") return
        try {
          localStorage.setItem(storageKey, "done")
        } catch {
          toast.error("Não foi possível guardar o estado do tutorial.")
        }
      },
    })
    driverRef.current.drive()
  }, [storageKey, toast])

  useEffect(() => {
    if (!ready) return
    let seen: string | null
    try {
      seen = localStorage.getItem(storageKey)
    } catch {
      return
    }
    if (seen === "done") return
    const timer = window.setTimeout(startTour, 500)
    return () => window.clearTimeout(timer)
    // Só na primeira carga.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  useEffect(
    () => () => {
      driverRef.current?.destroy()
      driverRef.current = null
    },
    []
  )

  return (
    <Btn variant="outline" onClick={startTour} disabled={!ready}>
      Conhecer o painel
    </Btn>
  )
}
