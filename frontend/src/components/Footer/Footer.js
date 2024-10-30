import React, {Component} from "react";
import {Container} from "react-bootstrap";

class Footer extends Component {
    render() {
        return (
            <footer className="footer px-0 myFooter">
                <div className="myBackDropFilter">
                    <Container fluid>
                        <nav>
                            <ul className="footer-menu">
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        소개


                                        채용 정보

                                        약관


                                    </a>
                                </li>
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        도움말
                                    </a>
                                </li>
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        홍보 센터
                                    </a>
                                </li>
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        API
                                    </a>
                                </li>
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        개인정보처리방침
                                    </a>
                                </li>
                                <li>
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        위치
                                    </a>
                                </li>
                            </ul>
                            <p className="copyright text-center">
                                KMH Verified
                                © 2024 SingOrSong from KMH
                            </p>
                        </nav>
                    </Container>
                </div>
            </footer>
        );
    }
}

export default Footer;
