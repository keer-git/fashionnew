from typing import List, Dict
import requests
from bs4 import BeautifulSoup
import random
from datetime import datetime

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml",
}

def scrape_vogue_page(url):
    results = []

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        articles = soup.find_all("article")
        if not articles:
            articles = soup.find_all("div")

        for article in articles[:10]:

            title_el = article.find(["h1", "h2", "h3", "h4"])
            img_el = article.find("img")
            link_el = article.find("a", href=True)

            title = title_el.get_text(strip=True) if title_el else None

            if not title or len(title) < 5:
                continue

            img_url = ""
            if img_el:
                img_url = (
                    img_el.get("src")
                    or img_el.get("data-src")
                    or img_el.get("data-original")
                    or ""
                )

            art_url = link_el["href"] if link_el else url

            if art_url.startswith("/"):
                art_url = "https://www.vogue.com" + art_url

            product = {
                "productName": title[:120],
                "category": random.choice([
                    "Luxury Fashion", "Streetwear", "Casual Wear",
                    "Summer Collection", "Winter Collection", "Accessories"
                ]),
                "description": "Featured in Vogue – " + title[:100],
                "color": random.choice([
                    "Black", "White", "Ivory", "Beige", "Camel",
                    "Navy", "Cream", "Gold", "Red", "Blue"
                ]),
                "material": random.choice([
                    "Silk", "Cotton", "Wool", "Linen",
                    "Leather", "Cashmere", "Denim"
                ]),
                "season": random.choice([
                    "Spring/Summer", "Autumn/Winter", "All Season"
                ]),
                "imageUrl": img_url,
                "articleUrl": art_url,
                "publicationDate": datetime.now().isoformat(),
                "source": "scraped"
            }

            results.append(product)

    except Exception as e:
        print("Error:", str(e))

    return results