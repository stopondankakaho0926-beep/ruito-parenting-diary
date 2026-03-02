import { createClient } from '@/lib/supabase/server'

const PAYWALL_MARKER = '<!--paywall-->'

/**
 * Split article content into free and paid sections
 */
export function splitContent(content: string): {
  freeContent: string
  paidContent: string
  hasPaywall: boolean
} {
  const paywallIndex = content.indexOf(PAYWALL_MARKER)

  if (paywallIndex === -1) {
    return {
      freeContent: content,
      paidContent: '',
      hasPaywall: false,
    }
  }

  const freeContent = content.substring(0, paywallIndex).trim()
  const paidContent = content
    .substring(paywallIndex + PAYWALL_MARKER.length)
    .trim()

  return {
    freeContent,
    paidContent,
    hasPaywall: true,
  }
}

/**
 * Check if user has purchased the article
 */
export async function checkPurchase(
  articleId: string,
  userEmail?: string
): Promise<boolean> {
  if (!userEmail) {
    return false
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('purchases')
    .select('*')
    .eq('article_id', articleId)
    .eq('user_email', userEmail)
    .eq('status', 'completed')
    .single()

  return !!data
}

/**
 * Remove paywall markers from content for display
 */
function cleanPaywallMarkers(content: string): string {
  return content
    // HTMLコメントとして
    .replace(/<!--paywall-->/g, '')
    // エスケープされたテキストとして
    .replace(/&lt;!--paywall--&gt;/g, '')
    // 段落に包まれている場合
    .replace(/<p><!--paywall--><\/p>/g, '')
    .replace(/<p>&lt;!--paywall--&gt;<\/p>/g, '')
    // 空の段落も削除
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
}

/**
 * Get accessible content based on purchase status
 */
export async function getAccessibleContent(
  content: string,
  isPaid: boolean,
  articleId: string,
  userEmail?: string
): Promise<{
  content: string
  isPurchased: boolean
  needsPurchase: boolean
}> {
  // If article is free, return all content (without markers)
  if (!isPaid) {
    return {
      content: cleanPaywallMarkers(content),
      isPurchased: false,
      needsPurchase: false,
    }
  }

  // Check if user has purchased
  const isPurchased = await checkPurchase(articleId, userEmail)

  if (isPurchased) {
    // Return full content if purchased (without markers)
    return {
      content: cleanPaywallMarkers(content),
      isPurchased: true,
      needsPurchase: false,
    }
  }

  // Return only free content if not purchased
  const { freeContent, hasPaywall } = splitContent(content)

  return {
    content: cleanPaywallMarkers(freeContent),
    isPurchased: false,
    needsPurchase: hasPaywall || isPaid,
  }
}
